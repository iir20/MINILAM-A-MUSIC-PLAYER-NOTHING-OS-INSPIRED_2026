package com.minilam.os

import android.content.Context
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color as ComposeColor
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.provideContent
import androidx.glance.layout.*
import androidx.glance.text.Text
import androidx.glance.background
import androidx.glance.unit.ColorProvider
import androidx.glance.text.TextStyle
import androidx.glance.text.FontWeight
import androidx.glance.text.TextAlign

class VinylWidget : GlanceAppWidget() {
    override suspend fun provideGlance(context: Context, id: GlanceId) {
        provideContent {
            Column(
                modifier = GlanceModifier
                    .fillMaxSize()
                    .background(ComposeColor.Black)
                    .padding(8.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Header
                Text(
                    text = "VINYL_DECK_01",
                    style = TextStyle(color = ColorProvider(ComposeColor.White.copy(alpha = 0.3f)), fontSize = 8.sp, fontWeight = FontWeight.Bold)
                )
                
                Spacer(modifier = GlanceModifier.height(8.dp))

                // The Disc
                Box(
                    modifier = GlanceModifier
                        .size(120.dp)
                        .background(ComposeColor.DarkGray.copy(alpha = 0.3f))
                        .padding(2.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Box(
                        modifier = GlanceModifier
                            .fillMaxSize()
                            .background(ComposeColor.Black),
                        contentAlignment = Alignment.Center
                    ) {
                        // Groove simulations
                        repeat(3) { i ->
                            Box(
                                modifier = GlanceModifier
                                    .size((90 - (i * 20)).dp)
                                    .background(ComposeColor.White.copy(alpha = 0.05f))
                            ) {}
                        }
                        
                        // Center Label
                        Box(
                            modifier = GlanceModifier
                                .size(32.dp)
                                .background(ComposeColor(0xFFFF3B30)),
                            contentAlignment = Alignment.Center
                        ) {
                            Box(
                                modifier = GlanceModifier
                                    .size(8.dp)
                                    .background(ComposeColor.Black)
                            ) {}
                        }
                    }
                }
                
                Spacer(modifier = GlanceModifier.height(8.dp))
                
                Text(
                    text = "STATUS // ROTATING",
                    style = TextStyle(color = ColorProvider(ComposeColor.White), fontSize = 8.sp, fontWeight = FontWeight.Medium)
                )
            }
        }
    }
}
